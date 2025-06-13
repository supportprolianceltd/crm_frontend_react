import { useState } from 'react'
import { Link } from 'react-router-dom';


function DashFooter() {

  return (
    <footer className='dash-footer'>
     <p>© {new Date().getFullYear()} <Link to="/">Kaefy CRM</Link>. All rights reserved.</p>
    </footer>
  )
}

export default DashFooter
