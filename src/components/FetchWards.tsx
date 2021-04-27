import React, { useEffect } from "react";

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
  useEffect(() => {
    let activeController: AbortController;
    (async () => {
      const wardsMeta = await controlledFetch<MetaDataJSON>(
        "/data/wards/metadata.json"
      ).promise;
      new Array(wardsMeta.total).fill(0).forEach(async i => {
        const filename = `${i + 1}`.padStart(3, "0");
        const { promise, controller } = controlledFetch<WardDataJSON>(
          `/data/wards/${filename}.json`
        );
        activeController = controller;
        const res = await promise;
        console.log(res);
      });
    })();

    return () => {
      activeController && activeController.abort();
    };
  }, []);
  return null;
};
