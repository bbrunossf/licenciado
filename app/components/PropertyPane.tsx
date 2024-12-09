import React, { useEffect, useState } from "react";
import { select } from "@syncfusion/ej2-base";
import * as ReactDOM from 'react-dom';

import '../novo.css';

type PropertyPaneProps = {
  title: string;
  children: React.ReactNode;
};

const PropertyPane: React.FC<PropertyPaneProps> = ({ title, children }) => {
  
  return (
      <div className="property-panel-section">
        <div className="property-panel-header">{title}</div>
        <div className="property-panel-content">{children}</div>
      </div>      
    )  
};

export default PropertyPane;
