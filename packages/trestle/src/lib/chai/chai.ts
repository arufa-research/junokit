import './types';

// import { supportChangeScrtBalance } from './matchers/changeScrtBalance';
// import { supportChangeTokenBalance } from './matchers/changeTokenBalance';
// import { supportChangeTokenBalances } from './matchers/changeTokenBalances';
import { supportProperAddress } from './matchers/properAddress';
import { supportProperHex } from './matchers/properHex';
import { supportProperJunoAddress } from './matchers/properJunoAddress';
import { supportResponse } from './matchers/response';
import { supportReverted } from './matchers/revert';
import { supportRevertedWith } from './matchers/revertWith';

export function trestleChai (chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  supportProperHex(chai.Assertion);
  supportProperAddress(chai.Assertion);
  supportProperJunoAddress(chai.Assertion);
  // supportChangeScrtBalance(chai.Assertion);
  // supportChangeTokenBalance(chai.Assertion);
  // supportChangeTokenBalances(chai.Assertion);
  supportReverted(chai.Assertion);
  supportRevertedWith(chai.Assertion);
  supportResponse(chai.Assertion);
}
