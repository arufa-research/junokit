import { Decimal } from "decimal.js";
import { networkConstants } from "./constants";

// The number set here is an arbitrary number.
Decimal.set({ toExpPos: 50 });

// Convert to/from human and machine.
export function coinConvert(
  number: number | string,
  decimals: number,
  type?: "human" | "machine",
  fixed?: number
): string {
  if (!number) return "";

  let theNumber = number;
  if (typeof number === "number") {
    theNumber = number.toString();
  }

  let result: Decimal;
  if ((theNumber as string).indexOf(".") === -1) {
    // In case `number` is an integer
    if (type && type === "machine") {
      result = new Decimal(10).toPower(decimals).times(number);
    } else {
      result = new Decimal(number).dividedBy(new Decimal(10).toPower(decimals));
    }

    if (typeof fixed !== "undefined") {
      return result.toFixed(fixed);
    }
  } else {
    // In case is not an integer, we just handle it as float
    if (type && type === "human") {
      result = new Decimal(number);
    } else {
      result = new Decimal(10).toPower(decimals).times(number);
    }

    if (typeof fixed !== "undefined") {
      return result.toFixed(fixed);
    }
  }
  return result.toString();
}

export function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export const TxnLinkComp = (hash: string) => (
  <div>
    <span>Transaction hash </span>
    <a style={{ color: "black" }} href={`${networkConstants['JunoMainnet'].mintscanPrefix}${hash}`}>
      {hash}
    </a>
  </div>
);
