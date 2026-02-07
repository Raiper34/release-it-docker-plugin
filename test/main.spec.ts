import {describe, expect, it, vi} from 'vitest';
import DockerPlugin  from '../src/index.js';

const DEFAULT_CONFIG = {contextOptions: {version: '1.0.0'}};
const DEFAULT_OPTIONS = {imageName: 'my-image'};

function prepareDockerPlugin(options: any = {}, config: any = {}, error = false): DockerPlugin {
    const plugin = new DockerPlugin({namespace: 'DEFAULT', options: {DEFAULT: options}, container: {config, prompt: {register: () => undefined}}} as any);
    vi.spyOn(plugin, 'exec').mockReturnValue(error ? Promise.reject() : Promise.resolve());
    vi.spyOn(plugin, 'setContext');
    vi.spyOn(plugin, 'debug');
    return plugin;
}

describe('Main tests', () => {

    it('should instantiate', () => {
        expect(prepareDockerPlugin()).toBeDefined();
    });

    describe('buildX', () => {

        it('should construct command - defaults', () => {
            const plugin = prepareDockerPlugin(DEFAULT_OPTIONS, DEFAULT_CONFIG);

            plugin.buildx();

            const expectedCommand = 'docker buildx build -t my-image:1.0.0 --platform linux/arm64,linux/amd64 --push .';
            expect(plugin.exec).toHaveBeenCalledWith(expectedCommand);
        });

        it('should construct command - options', () => {
            const options = {...DEFAULT_OPTIONS, latestTag: true, builder: 'my-builder', platform: 'linux/arm64'};
            const plugin = prepareDockerPlugin(options, DEFAULT_CONFIG);

            plugin.buildx();

            const expectedCommand = 'docker buildx build -t my-image:1.0.0 -t my-image:latest --platform linux/arm64 --builder my-builder --push .';
            expect(plugin.exec).toHaveBeenCalledWith(expectedCommand);
        });

        it('should construct command - output docker (local registry)', () => {
            const options = {...DEFAULT_OPTIONS, output: 'docker'};
            const plugin = prepareDockerPlugin(options, DEFAULT_CONFIG);

            plugin.buildx();

            const expectedCommand = 'docker buildx build -t my-image:1.0.0 --platform linux/arm64,linux/amd64 --load .';
            expect(plugin.exec).toHaveBeenCalledWith(expectedCommand);
        });

        it('should construct command - output registry (remote registry)', () => {
            const options = {...DEFAULT_OPTIONS, output: 'registry'};
            const plugin = prepareDockerPlugin(options, DEFAULT_CONFIG);

            plugin.buildx();

            const expectedCommand = 'docker buildx build -t my-image:1.0.0 --platform linux/arm64,linux/amd64 --push .';
            expect(plugin.exec).toHaveBeenCalledWith(expectedCommand);
        });

        it('should set context', async () => {
            const plugin = prepareDockerPlugin(DEFAULT_OPTIONS, DEFAULT_CONFIG);

            await plugin.buildx();

            expect(plugin.setContext).toHaveBeenCalledWith({ isBuilt: true });
        });

        it('should call debug on error', async () => {
            const plugin = prepareDockerPlugin(DEFAULT_OPTIONS, DEFAULT_CONFIG, true);

            await expect(plugin.buildx()).rejects.toBeDefined();
            expect(plugin.debug).toHaveBeenCalled();
        });

    })

});