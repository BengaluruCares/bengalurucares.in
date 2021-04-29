import React, { useEffect } from "react";

import useWardStore, { getUpdateState } from "@src/stores/ward.store";
import { controlledFetch, getUrl } from "@src/utils";

export interface MetaDataJSON {
  total: number;
}

export interface WardDataJSON {
  zone: string;
  division: string;
  sub_div: string;
  ward_no: string | number;
  ward_name: string;
  pin_code: string[];
  // For now this data is not defined
  telegram_group: null | any;
}

export const FetchWards: React.FC = () => {
  const updateStore = useWardStore(getUpdateState);
  useEffect(() => {
    let activeController: AbortController | null = null;
    (async () => {
      const wardsMeta = await controlledFetch<MetaDataJSON>(
        getUrl("data/wards/metadata.json")
      ).promise;
      for (let index = 0; index < wardsMeta.total; index++) {
        if (activeController && activeController.signal.aborted) {
          return;
        }
        const filename = `${index + 1}`.padStart(3, "0");
        const { promise, controller } = controlledFetch<WardDataJSON>(
          getUrl(`data/wards/${filename}.json`)
        );
        activeController = controller;
        let data = undefined;
        try {
          data = await promise;
        } catch (e) {
          // NOOP
        }
        if (data) {
          updateStore("wardList", data);
        }
      }
    })();

    return () => {
      activeController && activeController.abort();
    };
  }, []);
  return null;
};
