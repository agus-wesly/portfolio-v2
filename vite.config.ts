import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import  fs  from "node:fs"

const __dirname = dirname(fileURLToPath(import.meta.url))

const blogFiles = await fs.promises.readdir("./blogs");
const blogInput = {}
for (const blogFileName of blogFiles) {
    const name = `blogs/${blogFileName}`
    blogInput[name] = resolve(__dirname, name)
}

export default defineConfig({
    base: '/portfolio-v2/',
    plugins: [
        tailwindcss()
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                blog: resolve(__dirname, "blog.html"),
                ...blogInput
            },
        }
    }
})
