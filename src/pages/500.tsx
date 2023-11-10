// ** Next Import
import { useRouter } from 'next/navigation'

// ** MUI Components
import {Button, Typography, Box } from '@mui/material'

// ** Footer Imports
import FooterIllustrations from '@/common/ServerPagesFooter/footerIllustrations'

// ** Styled Components
import { BoxWrapper, Img } from '../lib/errorCodePagesDesign'
import styles from '../styles/errorCodePages.module.css'


const Error500 = () => {
    const router = useRouter()
  return (
    <Box className='content-center'>
      <Box className={styles.mainBoxContainer}>
        <BoxWrapper>
          <Typography variant='h1' className={styles.errorCodeTypography}>
            500
          </Typography>
          <Typography variant='h5' className={styles.errorCodeTypographyMessage}>
            Internal server error 👨🏻‍💻
          </Typography>
          <Typography variant='body2'>Oops, something went wrong!</Typography>
        </BoxWrapper>
        <Img alt='error-illustration' src='/Images/error_pages/500.png' />
        <Button onClick={() => router.back()} variant='contained' className={styles.errorCodeBackButton}>
          Go Back
        </Button>
      </Box>
      <FooterIllustrations pageCode={'500'} />
    </Box>
  )
}

export default Error500
