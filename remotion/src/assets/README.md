# Remotion assets

Drop production stills, voiceover audio, and any local fonts here.

```
remotion/src/assets/
├── stills/
│   ├── kitchen-placeholder.jpg     <- referenced by KitchenScene defaultProps
│   ├── three-mailboxes.jpg
│   └── finish-line.jpg
├── voiceover/
│   ├── kitchen.mp3                 <- ElevenLabs export
│   └── ...
└── fonts/                          (optional — Google Fonts CDN works by default)
```

Stills are pulled in via `staticFile("stills/<name>.jpg")` from
`KitchenScene`. Replace the placeholder with the approved Nano Banana
Pro render once Tristian has signed off on the prompt.
