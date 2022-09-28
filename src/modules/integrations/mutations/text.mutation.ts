import { File } from '../../storage/file';
import { definePropertiesMutation, mutateClass } from '../../../utils/mutation';
import { edit } from '../editor';
import { Text } from '../../data/text';
import { tmp } from '../../storage/tmp';
import { DataFormat } from '../../data/data-format';

declare module '../../data/text' {
  interface Text {
    edit(): File;

    browse(): File;

    open(app?: string): File;
  }
}

mutateClass(
  Text,
  definePropertiesMutation({
    edit: {
      value(): File {
        return edit(this);
      },
    },

    browse: {
      value(): File {
        const tmpFile = tmp(this.ext);

        let content = String(this);
        if (
          this.format === DataFormat.Html &&
          !content.toLowerCase().includes('<html')
        ) {
          content = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title></title>
    <!-- CSS only -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
  
    <style>
     body {
       margin: 5px
     }
    </style>
  </head>
  <body>
    ${this.text}
  </body>
</html>
;`;
        }

        tmpFile.text = content;

        return tmpFile.browse();
      },
    },

    open: {
      value(app?: string): File {
        const tmpFile = tmp(this.ext);
        tmpFile.text = this;

        return tmpFile.open(app);
      },
    },
  }),
);
