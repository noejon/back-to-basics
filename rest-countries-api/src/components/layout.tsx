import { ComponentChildren } from "preact"

interface Props {
  children: ComponentChildren,
}

export function Layout({children}: Props) {
  return <div class="flex flex-column full-width">
    <header><h1 class="text-center">Preact countries REST API</h1></header>
    <main class="main-wrapper">{children}</main>
    <footer class="text-center">Made with ❤️ by Jon</footer>
  </div>
}