export type File = {
  name: string;
  kind: "file";
  size: string;
  modified: string;
};

export function isFile(item: File | Directory): item is File {
  return item.kind === "file";
}

export type Directory = {
  name: string;
  kind: "directory";
  children: Readonly<Array<File | Directory>>;
};

export function isDirectory(item: File | Directory): item is Directory {
  return item.kind === "directory";
}

export type FileTree = Readonly<Array<File | Directory>>;

export const data: FileTree = [
  {
    name: "project",
    kind: "directory",
    children: [
      {
        name: "src",
        kind: "directory",
        children: [
          {
            name: "index.js",
            kind: "file",
            size: "1KB",
            modified: "2022-03-08 11:30:00",
          },
          {
            name: "components",
            kind: "directory",
            children: [
              {
                name: "Button.jsx",
                kind: "file",
                size: "2KB",
                modified: "2022-03-07 15:00:00",
              },
              {
                name: "Card.jsx",
                kind: "file",
                size: "3KB",
                modified: "2022-03-06 10:00:00",
              },
            ],
          },
          {
            name: "styles",
            kind: "directory",
            children: [
              {
                name: "index.css",
                kind: "file",
                size: "1KB",
                modified: "2022-03-07 09:00:00",
              },
              {
                name: "components.css",
                kind: "file",
                size: "2KB",
                modified: "2022-03-06 12:00:00",
              },
            ],
          },
        ],
      },
      {
        name: "public",
        kind: "directory",
        children: [
          {
            name: "index.html",
            kind: "file",
            size: "1KB",
            modified: "2022-03-08 10:00:00",
          },
          {
            name: "favicon.ico",
            kind: "file",
            size: "5KB",
            modified: "2022-03-07 16:00:00",
          },
        ],
      },
      {
        name: "package.json",
        kind: "file",
        size: "1KB",
        modified: "2022-03-08 12:00:00",
      },
      {
        name: "README.md",
        kind: "file",
        size: "2KB",
        modified: "2022-03-08 13:00:00",
      },
    ],
  },
];

export const icons = {
  svelte: "i-logos-svelte-icon",
  folder: "i-solar-folder-2-bold-duotone",
  folderOpen: "i-solar-folder-open-bold-duotone",
  js: "i-mdi-language-javascript color-yellow-4",
  json: "i-file-icons-json-1 color-lime-6",
  md: "i-mdi-language-markdown color-cyan-3",
  html: "i-mdi-language-html5 color-orange-6",
  css: "i-mdi-language-css3 color-blue-4",
  ico: "i-solar-camera-bold-duotone color-indigo-4",
  jsx: "i-mdi-language-jsx color-yellow-4",
  highlight: "i-solar-arrow-left-bold",
  unknown: "i-solar-question-circle-bold",
};

type Icon = keyof typeof icons;

type GetIconArgs = {
  item: File | Directory;
  isExpanded?: boolean;
};

export function getIcon({ item, isExpanded }: GetIconArgs): string {
  if (isDirectory(item)) {
    return isExpanded ? icons.folderOpen : icons.folder;
  }

  const fileExt = item.name.split(".").pop();
  return icons[fileExt as Icon] ?? icons.unknown;
}
