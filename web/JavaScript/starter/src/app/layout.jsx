import { auth } from '@/auth'
import AuthProvider from '@/components/auth/AuthProvider'
import { AuthProvider as CustomAuthProvider } from '@/contexts/AuthContext'
import ThemeProvider from '@/components/template/Theme/ThemeProvider'
import pageMetaConfig from '@/configs/page-meta.config'
import NavigationProvider from '@/components/template/Navigation/NavigationProvider'
import { getNavigation } from '@/server/actions/navigation/getNavigation'
import { getTheme } from '@/server/actions/theme'
import '@/assets/styles/app.css'

export const metadata = {
    ...pageMetaConfig,
}

export default async function RootLayout({ children }) {
    const session = await auth()

    const navigationTree = await getNavigation()

    const theme = await getTheme()

    return (
        <AuthProvider session={session}>
            <html
                className={theme.mode === 'dark' ? 'dark' : 'light'}
                dir={theme.direction}
                suppressHydrationWarning
            >
                <body suppressHydrationWarning>
                    <ThemeProvider theme={theme}>
                        <CustomAuthProvider>
                            <NavigationProvider navigationTree={navigationTree}>
                                {children}
                            </NavigationProvider>
                        </CustomAuthProvider>
                    </ThemeProvider>
                </body>
            </html>
        </AuthProvider>
    )
}
