import {
  definePropertiesMutation,
  mutateClass,
} from '../../../utils/mutation.utils';
import { DataFormat } from '../../../wrappers/data-format.wrapper';
import { File } from '../../../wrappers/file.wrapper';
import { Text } from '../../../wrappers/text.wrapper';
import { TmpFile } from '../../../wrappers/tmp-file.wrapper';
import { edit } from '../utils/editor.utils';

declare module '../../../wrappers/text.wrapper' {
  interface Text {
    /**
     * Opens the text in the default editor.
     */
    edit(): File;

    /**
     * Opens the text in the default browser.
     */
    browse(): File;

    /**
     * Opens the text in the default or given app.
     */
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
        const tmpFile = TmpFile.create(this.ext);

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
`;
        }

        tmpFile.text = content;

        return tmpFile.browse();
      },
    },

    open: {
      value(app?: string): File {
        const tmpFile = TmpFile.create(this.ext);
        tmpFile.text = this;

        return tmpFile.open(app);
      },
    },
  }),
);
