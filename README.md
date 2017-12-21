# gitignored

Check if staged files should be ignored by some of [https://github.com/github/gitignore](https://github.com/github/gitignore).

## Installation

```sh
npm install --save-dev gitignored
```

## Usage

### lint-staged

Recommended way is to use `gitignored` as a pre-commit hook with [lint-staged](https://github.com/okonet/lint-staged).

For example `package.json`:
```json
"lint-staged": {
  "*": "gitignored"
},
"gitignored": {
  "types": ["Global/macOS", "Global/Linux"]
}
```

### CLI

```sh
gitignored -t Global/macOS,Global/Linux file1 file2
```

## Config

- package.json

.gitignoredrc

yaml
```json
types:
  - Global/macOS
  - Global/Linux
```

json
```json
{
  "types": ["Global/macOS", "Global/Linux"]
}
```
