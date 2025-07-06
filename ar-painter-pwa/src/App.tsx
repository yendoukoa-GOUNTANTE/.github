import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ethers, Contract } from 'ethers';
import './index.css'; // Ensure global styles are loaded
import { Pattern, PatternAI, patternsLibrary } from './patterns';
import { contractAddress, contractABI, SEPOLIA_CHAIN_ID } from './contractInfo';

// A-Frame components are typically registered globally when 'aframe' is imported.

interface ARPainterPageProps {}

const ARPainterPage: React.FC<ARPainterPageProps> = () => {
  const [arSupported, setArSupported] = useState(false);
  const [inAR, setInAR] = useState(false);
  const sceneRef = useRef<any>(null);
  const reticleRef = useRef<any>(null);

  const patternAI = useMemo(() => new PatternAI(), []);
  const [suggestedPattern, setSuggestedPattern] = useState<Pattern | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(patternsLibrary[0]);

  // Web3 States
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [nftContract, setNftContract] = useState<Contract | null>(null);
  const [networkCorrect, setNetworkCorrect] = useState<boolean | null>(null);
  const [txMessage, setTxMessage] = useState<string>('');
  const [isMinting, setIsMinting] = useState<boolean>(false);

  // Game Loop State
  const paintingGoal = 3; // Objective: Paint 3 objects
  const [paintedObjectsCount, setPaintedObjectsCount] = useState<number>(0);
  const [objectiveMet, setObjectiveMet] = useState<boolean>(false);

  useEffect(() => {
    if (paintedObjectsCount >= paintingGoal) {
      setObjectiveMet(true);
      // Optionally, provide more feedback here, e.g., a congratulatory message
      console.log("Painting objective met!");
      setTxMessage(prev => prev + (prev ? " " : "") + "Objective complete! You can now claim your reward.");
    } else {
      setObjectiveMet(false);
    }
  }, [paintedObjectsCount, paintingGoal]);

  useEffect(() => {
    setSuggestedPattern(patternAI.suggestPattern());
  }, [patternAI]);

  // AR and Painting Logic Effect
  useEffect(() => {
    const sceneEl = sceneRef.current;
    if (sceneEl) {
      const checkARSupport = async () => {
        if (navigator.xr) {
          try {
            const supported = await navigator.xr.isSessionSupported('immersive-ar');
            setArSupported(supported);
            if (supported) console.log("AR is supported");
            else console.log("AR is not supported on this device/browser.");
          } catch (e) { console.error("Error checking AR support:", e); setArSupported(false); }
        } else { console.log("WebXR API not found."); setArSupported(false); }
      };
      checkARSupport();

      const onEnterAR = () => {
        setInAR(true);
        console.log("Entered AR mode");
        sceneEl.setAttribute('ar-hit-test', 'enabled', true);
        if(reticleRef.current) reticleRef.current.setAttribute('visible', true);
      };
      const onExitAR = () => {
        setInAR(false);
        console.log("Exited AR mode");
        sceneEl.setAttribute('ar-hit-test', 'enabled', false);
        if(reticleRef.current) reticleRef.current.setAttribute('visible', false);
      };
      sceneEl.addEventListener('enter-vr', onEnterAR);
      sceneEl.addEventListener('exit-vr', onExitAR);

      const handleSceneClick = (event: MouseEvent) => {
        // Prevent painting when clicking on any UI element
        if ((event.target as HTMLElement)?.closest('.ui-container') || (event.target as HTMLElement)?.closest('.blockchain-ui')) {
             console.log("Clicked on UI, not painting.");
            return;
        }
        if (!inAR || !reticleRef.current ) return;
        const reticleIsVisible = reticleRef.current.getAttribute('visible');
        if (!reticleIsVisible) { console.log("Reticle not visible, no valid hit point."); return; }

        const position = reticleRef.current.getAttribute('position');
        let paintMark: any;
        switch (selectedPattern.style) {
          case 'stripes':
            paintMark = document.createElement('a-box');
            paintMark.setAttribute('depth', '0.1');
            paintMark.setAttribute('height', '0.1');
            paintMark.setAttribute('width', '0.1');
            console.log(`Painting with stripes pattern: ${selectedPattern.name}`);
            break;
          case 'polka-dots':
          case 'gradient':
          case 'solid':
          default:
            paintMark = document.createElement('a-sphere');
            paintMark.setAttribute('radius', '0.05');
            console.log(`Painting with ${selectedPattern.style} pattern: ${selectedPattern.name}`);
            break;
        }
        paintMark.setAttribute('color', selectedPattern.color1);
        // If color2 exists, we might use it for something (e.g. wireframe, or a second element for stripes)
        // For PoC, just using color1 for the main primitive.
        if (selectedPattern.style === 'stripes' && selectedPattern.color2) {
             // Example: make wireframe of second color
             paintMark.setAttribute('material', `color: ${selectedPattern.color1}; wireframe: true; wireframeLinewidth: 3; wireframeColor: ${selectedPattern.color2}`);
        }

        paintMark.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
        sceneEl.appendChild(paintMark);
        console.log('Placed mark for pattern:', selectedPattern.name, 'at:', position);

        // Increment painted objects count if not already met the goal (to avoid over-counting if user keeps clicking)
        if (!objectiveMet) {
            setPaintedObjectsCount(prevCount => prevCount + 1);
        }
      };
      sceneEl.addEventListener('click', handleSceneClick);
      return () => {
        sceneEl.removeEventListener('enter-vr', onEnterAR);
        sceneEl.removeEventListener('exit-vr', onExitAR);
        sceneEl.removeEventListener('click', handleSceneClick);
      };
    }
  }, [selectedPattern, patternAI, inAR]); // Added inAR to dependencies for scene click logic

  // Wallet Connection Logic
  const connectWallet = async () => {
    setTxMessage('');
    if (typeof window.ethereum !== 'undefined') {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);

        const web3Signer = await web3Provider.getSigner();
        const address = await web3Signer.getAddress();

        setProvider(web3Provider);
        setSigner(web3Signer);
        setUserAddress(address);

        const network = await web3Provider.getNetwork();
        if (Number(network.chainId) === SEPOLIA_CHAIN_ID) {
          setNetworkCorrect(true);
          const contract = new ethers.Contract(contractAddress, contractABI, web3Signer);
          setNftContract(contract);
          console.log("Wallet connected. Address:", address, "On Sepolia network.");
        } else {
          setNetworkCorrect(false);
          setTxMessage(`Please switch to Sepolia network (Chain ID: ${SEPOLIA_CHAIN_ID}). Your current network ID: ${network.chainId}`);
          console.warn("Wrong network. Please switch to Sepolia.");
        }

        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            setUserAddress(accounts[0]);
            web3Provider.getSigner().then(newSigner => {
                 setSigner(newSigner);
                 if (Number(network.chainId) === SEPOLIA_CHAIN_ID) { // Re-init contract if network was correct
                    const newContract = new ethers.Contract(contractAddress, contractABI, newSigner);
                    setNftContract(newContract);
                 }
            });
            console.log("Account changed to:", accounts[0]);
          } else { // Wallet disconnected
            setUserAddress(null); setSigner(null); setNftContract(null); setProvider(null); setNetworkCorrect(null);
            console.log("Wallet disconnected.");
          }
        });

        window.ethereum.on('chainChanged', (chainIdHex: string) => {
          const chainId = parseInt(chainIdHex, 16);
          console.log("Network changed to:", chainId);
          const newProvider = new ethers.BrowserProvider(window.ethereum); // Get fresh provider on chain change
          setProvider(newProvider);
          if (chainId === SEPOLIA_CHAIN_ID) {
            setNetworkCorrect(true);
            setTxMessage('');
            newProvider.getSigner().then(newSigner => {
              setSigner(newSigner);
              const contract = new ethers.Contract(contractAddress, contractABI, newSigner);
              setNftContract(contract);
            });
          } else {
            setNetworkCorrect(false);
            setSigner(null); // Signer may be invalid on wrong network
            setNftContract(null);
            setTxMessage(`Switched to wrong network. Please switch back to Sepolia (ID: ${SEPOLIA_CHAIN_ID}).`);
          }
        });

      } catch (error) {
        console.error("Error connecting wallet:", error);
        setTxMessage("Failed to connect wallet. See console.");
      }
    } else {
      setTxMessage("MetaMask (or other Web3 wallet) not detected. Please install it.");
      console.error("MetaMask not detected.");
    }
  };

  const handleMintReward = async () => {
    if (!nftContract || !userAddress || !networkCorrect || !signer) {
      setTxMessage("Wallet not connected properly to Sepolia network.");
      console.error("Minting prerequisites not met: contract, userAddress, networkCorrect, or signer missing.");
      return;
    }
    setIsMinting(true);
    setTxMessage("Minting 'Awesome Painter' reward NFT...");
    try {
      const rewardName = "Awesome Painter Award";
      // Ensure contract is connected to the signer for write transactions
      const contractWithSigner = nftContract.connect(signer) as Contract;
      const tx = await contractWithSigner.mintReward(userAddress, rewardName);

      setTxMessage(`Transaction sent! Hash: ${tx.hash}. Waiting...`);
      console.log("Minting transaction sent:", tx.hash);

      const receipt = await tx.wait();

      setTxMessage(`Reward NFT '${rewardName}' minted! Tx: ${receipt.hash}`);
      console.log("Reward NFT minted successfully!", receipt);

    } catch (error: any) {
      console.error("Error minting reward NFT:", error);
      setTxMessage(`Error minting: ${error?.reason || error?.message || 'Unknown error. See console.'}`);
    } finally {
      setIsMinting(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (suggestedPattern) setSelectedPattern(suggestedPattern);
    setSuggestedPattern(patternAI.suggestPattern());
  };

  const handleNextSuggestion = () => {
    setSuggestedPattern(patternAI.suggestRandomPattern());
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow:'hidden' }}>
      <a-scene
        ref={sceneRef}
        webxr="optionalFeatures: hit-test,dom-overlay,plane-detection; overlayElement: #ar-ui-overlay;"
        renderer="colorManagement: true; physicallyCorrectLights: true;"
        vr-mode-ui={`enabled: ${arSupported}; enterVRButton: #ar-enter-button;`}
        ar-hit-test="enabled: false;"
        ar-plane-manager
        style={{ width: '100%', height: '100%' }}
        debug={false} // Set to true for A-Frame inspector
      >
        <a-camera position="0 1.6 0" look-controls="magicWindowTrackingEnabled: false; touchEnabled: false; mouseEnabled: true">
          <a-cursor fuse="false" design="ring" visible={!inAR}></a-cursor>
        </a-camera>
        <a-sky color="#ECECEC" visible={!inAR}></a-sky>
        <a-entity ref={reticleRef} id="reticle" geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.015" material="color: #FFF; shader: flat; opacity: 0.8;" position="0 0 -0.5" visible="false" ar-hit-test-target />
        <a-light type="ambient" color="#BBB" />
        <a-light type="directional" color="#FFF" intensity="0.8" position="-0.5 1 1" />
      </a-scene>

      <div id="ar-ui-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, visibility: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>

        <div className="ui-container" style={{ visibility: inAR ? 'visible' : 'hidden', pointerEvents: 'auto', margin: '10px', background: 'rgba(255,255,255,0.9)', padding: '10px', borderRadius: '8px', maxWidth: '300px', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
          <p style={{fontWeight: 'bold', marginBottom: '8px', fontSize:'1em', borderBottom: '1px solid #eee', paddingBottom:'5px'}}>Painting Controls</p>

          {/* Game Objective UI */}
          <div style={{padding: '5px', margin: '5px 0 10px 0', background: objectiveMet ? 'lightgreen' : '#f0f0f0', borderRadius: '5px', border: '1px solid #ccc'}}>
            <p style={{fontSize: '0.9em', fontWeight: 'bold', color: objectiveMet? 'green' : '#333'}}>
              Objective: Paint {paintingGoal} objects
            </p>
            <p style={{fontSize: '0.85em', color: objectiveMet? 'green' : '#555'}}>
              Progress: {paintedObjectsCount} / {paintingGoal}
            </p>
            {objectiveMet && <p style={{fontSize: '0.85em', color: 'green', fontWeight:'bold'}}>Objective Complete!</p>}
          </div>
          <hr style={{margin: '8px 0'}}/>

          <div>
            <p style={{fontSize: '0.9em', marginBottom:'2px'}}>Selected: <strong style={{color: selectedPattern.color1}}>{selectedPattern.name}</strong></p>
            <div style={{display: 'flex', alignItems: 'center', margin: '5px 0 10px 0'}}>
              Preview:
              <div style={{ width: '24px', height: '24px', backgroundColor: selectedPattern.color1, border: '1px solid #333', marginLeft: '8px', borderRadius: selectedPattern.style === 'stripes' ? '0' : '50%' }}></div>
              {selectedPattern.color2 && <div style={{ width: '24px', height: '24px', backgroundColor: selectedPattern.color2, border: '1px solid #333', marginLeft: '3px', borderRadius: selectedPattern.style === 'stripes' ? '0' : '50%'}}></div>}
            </div>
          </div>
          <hr style={{margin: '8px 0'}}/>
          <div style={{margin: '10px 0'}}>
            <p style={{fontSize: '0.9em', marginBottom:'2px'}}>AI Suggests: <strong style={{color: suggestedPattern?.color1}}>{suggestedPattern?.name || 'None'}</strong></p>
            {suggestedPattern && (
              <div style={{display: 'flex', alignItems: 'center', margin: '5px 0 10px 0'}}>
                 Preview:
                <div style={{ width: '20px', height: '20px', backgroundColor: suggestedPattern.color1, border: '1px solid #ccc', marginLeft: '8px', borderRadius: suggestedPattern.style === 'stripes' ? '0' : '50%'}}></div>
                {suggestedPattern.color2 && <div style={{ width: '20px', height: '20px', backgroundColor: suggestedPattern.color2, border: '1px solid #ccc', marginLeft: '3px', borderRadius: suggestedPattern.style === 'stripes' ? '0' : '50%'}}></div>}
              </div>
            )}
            <button onClick={handleAcceptSuggestion} disabled={!suggestedPattern} style={{fontSize: '0.85em', padding: '6px 12px', marginRight: '8px', cursor:'pointer', borderRadius:'5px'}}>Accept</button>
            <button onClick={handleNextSuggestion} style={{fontSize: '0.85em', padding: '6px 12px', cursor:'pointer', borderRadius:'5px'}}>Next</button>
          </div>
          <hr style={{margin: '8px 0'}}/>
          <p style={{fontSize: '0.9em', marginBottom: '8px'}}>Or choose from library:</p>
          <div className="pattern-picker" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' }}>
            {patternsLibrary.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPattern(p)}
                title={p.name}
                style={{
                  padding: '6px',
                  border: selectedPattern.id === p.id ? '3px solid #007bff' : '1px solid #ccc',
                  background: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  minWidth: '55px',
                  textAlign: 'center',
                  borderRadius:'5px'
                }}
              >
                <div style={{display: 'flex', justifyContent:'center', marginBottom:'3px'}}>
                  <div style={{width: '18px', height: '18px', backgroundColor: p.color1, marginRight: p.color2 ? '2px' : '0', borderRadius: p.style === 'stripes' ? '0' : '50%', border:'1px solid #eee' }}></div>
                  {p.color2 && <div style={{width: '18px', height: '18px', backgroundColor: p.color2, borderRadius: p.style === 'stripes' ? '0' : '50%', border:'1px solid #eee'}}></div>}
                </div>
                <span style={{fontSize: '0.7em', display:'block', color:'#333'}}>{p.name.substring(0,10)}{p.name.length > 10 ? '...' : ''}</span>
              </button>
            ))}
          </div>
          <p style={{marginTop: '15px', fontSize: '0.8em', fontStyle:'italic', color: '#555'}}>Click on a detected AR surface to paint.</p>
        </div>

        <div className="blockchain-ui" style={{ position: 'absolute', bottom: inAR ? '80px': '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, background: 'rgba(20,20,20,0.85)', color: 'white', padding: '12px 18px', borderRadius: '10px', textAlign: 'center', pointerEvents: 'auto', minWidth: '320px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          {!userAddress ? (
            <button onClick={connectWallet} style={{padding: '10px 18px', fontSize:'0.95em', cursor:'pointer', background:'#007bff', color:'white', border:'none', borderRadius:'5px'}}>Connect Wallet</button>
          ) : (
            <div>
              <p style={{fontSize: '0.9em', marginBottom: '10px'}}>Connected: {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
                <span style={{color: networkCorrect === null ? 'yellow' : networkCorrect ? 'lightgreen' : 'orange', marginLeft:'8px', fontWeight: networkCorrect === false ? 'bold' : 'normal'}}>
                    ({networkCorrect === null ? 'Checking Network...' : networkCorrect ? 'Sepolia OK' : 'Wrong Network!'})
                </span>
              </p>
              <button
                onClick={handleMintReward}
                disabled={!objectiveMet || !nftContract || !networkCorrect || isMinting}
                style={{
                  padding: '10px 18px',
                  fontSize:'0.95em',
                  cursor: (!objectiveMet || !nftContract || !networkCorrect || isMinting) ? 'not-allowed' : 'pointer',
                  background: (!objectiveMet || !nftContract || !networkCorrect || isMinting) ? 'grey' : (objectiveMet ? '#28a745' : 'grey'),
                  color:'white',
                  border:'none',
                  borderRadius:'5px',
                  opacity: !objectiveMet ? 0.6 : 1
                }}
              >
                {isMinting ? "Minting Reward..." : (objectiveMet ? "Claim Reward NFT!" : "Complete Objective to Claim")}
              </button>
            </div>
          )}
          {txMessage && <p style={{fontSize: '0.8em', marginTop: '10px', wordBreak: 'break-word', background: 'rgba(255,255,255,0.1)', padding: '6px 8px', borderRadius: '5px'}}>{txMessage}</p>}
        </div>
      </div>

      {!inAR && arSupported && (
        <button id="ar-enter-button" className="ar-button">Enter AR</button>
      )}
      {!inAR && !arSupported && (
         <div className="ar-button" style={{backgroundColor: '#aaa', cursor:'default'}}>AR Not Supported</div>
      )}
      {inAR && (
        // A-Frame's vr-mode-ui typically handles the exit button if one is not specified.
        // If we want a custom one, ensure it calls sceneEl.exitVR()
        // For now, relying on A-Frame's default exit behavior (e.g. back button on phone or escape key)
        // Or, we can add a specific button if needed, absolutely positioned.
        // Let's add one for clarity, though A-Frame usually provides one.
         <button className="ar-button" style={{bottom: '20px', right: '20px', left:'auto', transform:'none', background:'#dc3545'}} onClick={() => sceneRef.current?.exitVR()}>Exit AR</button>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<ARPainterPage />} />
        </Routes>
    </Router>
  );
};

export default App;
