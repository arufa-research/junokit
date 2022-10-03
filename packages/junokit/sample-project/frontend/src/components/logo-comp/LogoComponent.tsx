import React from 'react'
import juno from '../../images/juno.png';
import seText from '../../images/logoText.png';
import seLogo from '../../images/flatwhite.png';
import arufaLogo from '../../images/arufa.png';
import './LogoComponent.css'
const LogoComponent = () => {
  return (<div>
    <div className='logo-header-text'>Built With</div>
    <div className='all-logo-wrapper'>
        <div className='juno-logo-wrapper'>
            <img src={juno}/>
            <div className='juno-text-label'>JUNO</div>
        </div>
        <div className='ar-logo-wrapper'>
            <img src={arufaLogo} />
        </div>
        <div className='se-logo-wrapper'>
            <div className='se-white-logo-wrapper'><img src={seLogo} /></div>
            <div className='se-text-logo-wrapper'><img src={seText} /></div>
        </div>

    </div>
    </div>
  )
}

export default LogoComponent