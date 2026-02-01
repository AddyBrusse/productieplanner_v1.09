import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

import {Button} from "@/components/ui/button";

function App(): React.JSX.Element {

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="mx-auto flex max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
  <img className="size-12 shrink-0" src="/img/logo.svg" alt="ChitChat Logo" />
  <div>
    <div className="text-xl font-medium text-green-500 dark:text-white">ChitChat</div>
    <p className="text-red-400 dark:text-gray-400">You have a new message!</p>
  </div>
</div>
      <Versions></Versions>
      <Button variant={'destructive'}>Click me</Button>
    </>
  )
}

export default App
