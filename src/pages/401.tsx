// ** Next Import
import { useRouter } from 'next/navigation'

// ** MUI Components
import {Button, Typography, Box } from '@mui/material'

// ** Footer Imports
import FooterIllustrations from '@/common/ServerPagesFooter/footerIllustrations'

// ** Styled Components
import { BoxWrapper, Img } from '../lib/errorCodePagesDesign'
import styles from '../styles/errorCodePages.module.css'

const Error401 = () => {
    const router = useRouter()     

  return (
    <Box>
      <Box className={styles.mainBoxContainer} >
        <BoxWrapper>
          <Typography variant='h1' className={styles.errorCodeTypography}>
            401
          </Typography>
          <Typography variant='h5' className={styles.errorCodeTypographyMessage}>
            You are not authorized! 🔐
          </Typography>
          <Typography variant='body2'>You don&prime;t have permission to access this page. Go Home!</Typography>
        </BoxWrapper>
        <Img alt='error-illustration' src='/Images/error_pages/401.png' />
        <Button onClick={() => router.back()} variant='contained' className={styles.errorCodeBackButton}>
          Go Back
        </Button>
      </Box>
      <FooterIllustrations pageCode={'401'} />
    </Box>
  )
}

export default Error401
