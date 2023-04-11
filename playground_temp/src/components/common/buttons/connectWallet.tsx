import { accessSync } from "fs";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { useRecoilValue } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faWallet } from "@fortawesome/free-solid-svg-icons";

import { UserContext } from "../../../context/userState";
import { walletState } from "../../../context/walletState";
import {
  useConnectWallet,
  useDisconnetWallet,
} from "../../../hooks/useTxnClient";
import { coinConvert } from "../../../utils/common";
import "./buttons.css";
import PulseLoader from "react-spinners/PulseLoader";
import { useMessageToaster } from "../../../hooks/useMessageToaster";
import { networkState } from "../../../context/networkState";
import { networkConstants } from "../../../utils/constants";

const ConnectWalletButton = () => {
  const { isLoggingIn } = useContext(UserContext);
  const { address, balance, shortAddress, nickName } = useRecoilValue(walletState);
  const connectWallet = useConnectWallet();
  const { Success } = useMessageToaster();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { network } = useRecoilValue(networkState);

  let buttonName = shortAddress === undefined ? "Connect Wallet" : (shortAddress as string);
  if ((window as any).keplr === undefined) {
    buttonName = "Install Keplr";
  }

  const connectHandler = async () => {
    setIsLoading(true);
    if (address !== undefined) {
      window.open(`https://www.mintscan.io/secret/account/${address}`);
    } else {
      await connectWallet();
    }
    setIsLoading(false);
  };

  const resetUserData = useDisconnetWallet();

  const copyAddress = () => {
    navigator.clipboard.writeText(address || "");
    Success("Address copied to clipboard!");
  };

  return (
    <div className={ address? "connect-wallet-container" : "connect-wallet-container disconnected"}>
      <div className="wallet-button wb-top">
        {isLoading ? (
          <PulseLoader
            color="#000000"
            loading={true}
            // cssOverride={override}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <>
            <button onClick={connectHandler} className="connect-wallet-button">
              {address ? nickName : ""}
            </button>
            {address ? " | ": ""}
            <button onClick={connectHandler} className="connect-wallet-button">
              {address ? shortAddress : "Connect Keplr"}
            </button>
            
          </>
        )}
      </div>
      {address && (
        <div className="wallet-button wb-top">
          <div className={`button-token-balance`}>
          {" | "}
            {/* <FontAwesomeIcon rotate={"20deg"} icon={faWallet} size="1x" /> */}
            <div>
              {networkConstants[network].baseSymbol}{" "}
              <span>{coinConvert(balance?.amount as string, 6, "human")}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="wallet-button wb-top">
      {address ? <div className="mid-wall">{" | "}</div>: ""}
      <div className="column-gap">
      {address && (
              <span onClick={copyAddress} className={`address-copy-wrapper`}>
                <FontAwesomeIcon icon={faCopy} size="1x" />
                <div className="floating-bubble-info copy-address-bubble-info">
                  Copy address!
                </div>
              </span>
            )}
            {address && (
              <>
                <span
                  onClick={resetUserData}
                  className="material-symbols-outlined logout-logo"
                >
                  logout
                </span>
                <div className="floating-bubble-info logout-bubble-info">
                  Logout!
                </div>
              </>
            )}
            </div>
      </div>
    </div>
  );
};

export default ConnectWalletButton;
