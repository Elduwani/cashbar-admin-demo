import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark'
interface ContextInterface {
   theme: Theme,
   defaultTheme: boolean
   setTheme: (theme: Theme) => void,
}

export const ThemeContext = createContext({} as ContextInterface)
export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
   const [theme, setTheme] = useState<Theme>(() => {
      //check localStorage
      return 'light'
   })

   return (
      <ThemeContext.Provider value={{
         theme,
         defaultTheme: theme === 'light',
         setTheme
      }}>
         {children}
      </ThemeContext.Provider>
   );
}