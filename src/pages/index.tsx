import { useRouter } from 'next/router'
import HomePage from './home'
import { GenerateToken } from '@/services/auth'
export const getHomeRoute = (role: number) => {
  if (role === 1) return '/dashboard'
  else return '/profile'
}
export default function Home() {
  const router: any = useRouter()
  //getHomeRoute(2)
  GenerateToken();
  if (typeof window !== "undefined") {
    if (router?.asPath === '/') {
      return (<HomePage />)
    } else {
      router.push(router.asPath);
    }
  }
  return (<></>)
}



