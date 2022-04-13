import React from 'react'
import "@STYLE/common.css";

export default function CustomContainer({ children, style = {}, bgColor = "", height = "auto" }) {
  return (    
    <div className='container' style={{
        ...style,
        backgroundColor: style.backgroundColor && style.backgroundColor || bgColor,
        height: style.height && style.height || height
    }}>
        {children}
    </div>
  )
}
