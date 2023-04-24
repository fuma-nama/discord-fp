# @discord-fp/djs

## 4.1.0

### Minor Changes

- b1b4a2b: Change `initDiscordFP` parameters, use `start({ client })` to pass bot client instead

## 4.0.0

### Major Changes

- 97e1d61: Split code into core package

  Now you need to install the core package

  ```
  @discord-fp/core
  ```

- Rewrite Slash Command Options API and split code into core package

### Patch Changes

- Updated dependencies [97e1d61]
  - @discord-fp/core@4.0.0

## 3.0.1

### Patch Changes

- 2ed2a4f: Fix Empty options in slash command cause TypeError

## 3.0.0

### Major Changes

- 1d46689: Remove static builders, use `initDiscordFP` instead

## 3.0.0-alpha.0

### Major Changes

- 1d46689: Remove static builders, use `initDiscordFP` instead

## 2.0.3

### Patch Changes

- 79197a6: Remove unnecessary exports
- 06e8f00: Fix nested middlewares not being fired
