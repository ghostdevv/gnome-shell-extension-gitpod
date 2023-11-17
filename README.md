# Gitpod Gnome Extension

A work in progress gnome extension for Gitpod. Please [submit ideas/bugs here](https://github.com/ghostdevv/gnome-shell-extension-gitpod/issues/new)

## Running

I will try and make this work in Gitpod with VNC soon, but for now you can run this locally. You'll need Node 18+ and pnpm.

```bash
# Get Started
pnpm install

# Build
pnpm build

# Install the extension
gnome-extensions install --force dist/gitpod@willow.sh.zip
gnome-extensions enable gitpod@willow.sh
```

You'll probably need to log out/in after every change, I've been doing this in a Gnome Nightly OS VM via [Gnome Boxes](https://help.gnome.org/users/gnome-boxes/stable/)
