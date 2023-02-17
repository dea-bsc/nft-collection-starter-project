// App.js
// useEffect と useState 関数を React.js からインポートしています。
import myEpicNft from "./utils/MyEpicNFT.json";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./styles/App.css";
// Constantsを宣言する: constとは値書き換えを禁止した変数を宣言する方法です。
const App = () => {
  //ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
  const [currentAccount, setCurrentAccount] = useState("");
  const [jankenResult, setJankenResult] = useState("");
  
  //ユーザーが認証可能なウォレットアドレスを持っているか確認します。
  const checkIfWalletIsConnected = async () => {

    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    //ユーザーが認証可能なウォレットアドレスを持っている場合は、ユーザーに対してウォレットへのアクセス許可を求める。許可されれば、ユーザーの最初のウォレットアドレスをaccounts に格納する。
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const jankenStart = () =>{ 
    const hand = ["グー", "チョキ", "パー"];
    const comhand = ["グー", "チョキ", "パー"];
    //0,1,2の範囲でランダムな数字を返す
    const index = Math.floor(Math.random() * 3);
    const comindex = Math.floor(Math.random() * 3);

    if(index === 0){
      if(comindex === 1){
        console.log("win");
        askContractToMintNft();
      }else if(comindex === 0){
        console.log("draw");
      }else{
        console.log("lose");
      }
    }else if(index === 1){
      if(comindex === 2){
        console.log("win");
        askContractToMintNft();
      }else if(comindex === 1){
        console.log("draw");
      }else{
        console.log("lose");
      }
    }else{
      if(comindex === 0){
        console.log("win");
        askContractToMintNft();
      }else if(comindex === 2){
        console.log("draw");
      }else{
        console.log("lose");
      }
    }
  };

  //connectWallet メソッドを実装します。
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      //ウォレットアドレスに対してアクセスをリクエストしています。
       
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      //ウォレットアドレスを currentAccount に紐付けます。
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS =
      "0x2C4D4DbEA7A6c38739E007D4BBF407f0F5f1627A";
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();
        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // renderNotConnectedContainer メソッドを定義します。
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );
  //ページがロードされたときに useEffect()内の関数が呼び出されます。
   
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">セカイを変えるじゃんけん</p>
          <p className="sub-text">じゃんけんに勝利してNFTを手に入れよう</p>
          {/*条件付きレンダリングを追加しました
          // すでに接続されている場合は、
          // Connect to Walletを表示しないようにします。*/}
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={jankenStart} className="cta-button connect-wallet-button">
              じゃんけんを開始する
            </button>
          )}
        </div>
        <div>
          {jankenResult}
        </div>
      </div>
    </div>
  );
};
export default App;
