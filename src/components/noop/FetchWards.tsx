import React, { useEffect } from "react";

import useWardStore from "@src/stores/ward.store";
import { controlledFetch } from "@src/utils";

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
  const updateStore = useWardStore(store => store.updateState);
  useEffect(() => {
    let activeController: AbortController | null = null;
    (async () => {
      const wardsMeta = await controlledFetch<MetaDataJSON>(
        "/data/wards/metadata.json"
      ).promise;
      const values = new Array<number>(wardsMeta.total).fill(0).map(i => i);
      for await (const index of values) {
        if (activeController && activeController.signal.aborted) {
          break;
        }
        const filename = `${index + 1}`.padStart(3, "0");
        const { promise, controller } = controlledFetch<WardDataJSON>(
          `/data/wards/${filename}.json`
        );
        activeController = controller;
        const data = await promise;
        updateStore("wardList", data);
      }
    })();

    return () => {
      activeController && activeController.abort();
    };
  }, []);
  return null;
};
