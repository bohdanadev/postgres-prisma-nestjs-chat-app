import { createTheme, Flex, MantineProvider } from "@mantine/core";
import { MantineEmotionProvider } from "@mantine/emotion";

const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  primaryColor: 'cyan',
});

const MainLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <MantineProvider theme={theme}>
      <MantineEmotionProvider>
      <Flex>
        <Flex>{children}</Flex>
      </Flex>
      </MantineEmotionProvider>
    </MantineProvider>
  )
}

export default MainLayout;