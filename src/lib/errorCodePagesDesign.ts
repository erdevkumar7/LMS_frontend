import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Styled Components
export const Img = styled('img')(({ theme }:any) => ({
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8),
    [theme.breakpoints.down('lg')]: {
      height: 450,
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(10)
    },
    [theme.breakpoints.down('md')]: {
      height: 400
    }
  }))

export const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
      width: '90vw'
    }
  }))