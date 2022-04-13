import React, { useState } from 'react'
import CustomContainer from '@COMMON/CustomContainer'

export default function Top() {
    const [value, setValue] = useState("");

  return (
    <CustomContainer bgColor='green' height={150}>
        Top: <input type={"text"} value={value} onChange={(e) => setValue(e.target.value)} />
    </CustomContainer>
  )
}
