import React, { FC } from 'react';
import Headlines from './headlines';

type Props = {
  linkTo: string;
  heading:string;
  subHeading: string;
};

const HeadingButton: FC<Props> = ({ linkTo, heading, subHeading }) => {
  return (
      <>
    <div style={{ width: '200px', height: '100px', position: 'relative' }}>
      <a href={linkTo} style={{ display: 'block', width: '100%', height: '100%' }}>
        <button style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
         {heading}
         <br></br>
         {subHeading}
        </button>
      </a>
    </div>

  
    </>
  );
};

export default HeadingButton;