import React, { FC } from 'react';

type headings = {
  heading: string;
  subheading: string;
};

const Headlines: FC<headings> = ({ heading, subheading }) => {
  return (
    <div>
     {heading} 
     <br></br>
    {subheading}
    </div>
  );
};

export default Headlines;