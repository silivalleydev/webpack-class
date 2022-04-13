import React, { useState } from 'react'
import CustomContainer from '@COMMON/CustomContainer'

export default function Middle() {
    const [value, setValue] = useState("");

    console.log('sadfsafd')
  return (
    <CustomContainer bgColor='gray' height={200}>
        Middle: <input type={"text"} value={value} onChange={(e) => setValue(e.target.value)} />
    </CustomContainer>
  )
}
