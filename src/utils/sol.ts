import { exec } from 'shelljs';

export function rebuild() {
    exec(`pushd ${__dirname}/..;npm run build;popd`);
}
