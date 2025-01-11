import { debug } from 'node:util';
import _ from 'lodash';

const DOCKER_HUB_BASE_URL = 'https://hub.docker.com';

export default class DockerPlugin {

    static isEnabled() {
        return true;
    }

    static disablePlugin() {
        return null;
    }

    constructor({ namespace, options = {}, container = {} } = {}) {
        this.namespace = namespace;
        this.options = Object.freeze(this.getInitialOptions(options, namespace));
        this.context = {};
        this.config = container.config;
        this.log = container.log;
        this.shell = container.shell;
        this.spinner = container.spinner;
        this.prompt = container.prompt;
        this.debug = debug(`release-it:${namespace}`);

        this.registerPrompts({
            build: {type: 'confirm', message: () => 'Build docker image?', default: !!this.options.build},
            push: {type: 'confirm', message: () => 'Push to docker hub?', default: !!this.options.push},
        });
    }

    async beforeRelease() {
        return this.step({ task: () => this.build(), label: 'docker build', prompt: 'build'});
    }

    async release() {
        return this.step({ task: () => this.push(), label: 'docker push', prompt: 'push'});
    }

    afterRelease() {
        const { isPushed } = this.getContext();
        if (isPushed) {
            this.log.log(`🔗 ${DOCKER_HUB_BASE_URL}/r/${this.options.imageName}`);
        }
    }

    build() {
        const { imageName, latestTag } = this.options;
        const args = [
            '-t', `${imageName}:${this.config.contextOptions.version}`,
            ...(latestTag ? ['-t', `${imageName}:latest`] : [])
        ];
        return this.exec(`docker build ${args.filter(Boolean).join(' ')} .`).then(
            () => this.setContext({ isBuilt: true }),
            (err) => {
                this.debug(err);
                throw new Error(err);
            }
        );
    }

    push() {
        const { imageName, latestTag } = this.options;
        return Promise.all([
            this.exec(`docker push ${imageName}:${this.config.contextOptions.version}`),
            latestTag ? this.exec(`docker push ${imageName}:latest`) : Promise.resolve(),
        ]).then(
            () => this.setContext({ isPushed: true }),
            (err) => {
                this.debug(err);
                throw new Error(err);
            }
        );
    }

    getInitialOptions(options, namespace) {
        return options[namespace] || {};
    }

    init() {}
    getName() {}
    getLatestVersion() {}
    getChangelog() {}
    getIncrement() {}
    getIncrementedVersionCI() {}
    getIncrementedVersion() {}
    beforeBump() {}
    bump() {}

    getContext(path) {
        const context = _.merge({}, this.options, this.context);
        return path ? _.get(context, path) : context;
    }

    setContext(context) {
        _.merge(this.context, context);
    }

    exec(command, { options, context = {} } = {}) {
        const ctx = Object.assign(context, this.config.getContext(), { [this.namespace]: this.getContext() });
        return this.shell.exec(command, options, ctx);
    }

    registerPrompts(prompts) {
        this.prompt.register(prompts, this.namespace);
    }

    async showPrompt(options) {
        options.namespace = this.namespace;
        return this.prompt.show(options);
    }

    step(options) {
        const context = Object.assign({}, this.config.getContext(), { [this.namespace]: this.getContext() });
        const opts = Object.assign({}, options, { context });
        const isException = this.config.isPromptOnlyVersion && ['incrementList', 'publish', 'otp'].includes(opts.prompt);
        return this.config.isCI && !isException ? this.spinner.show(opts) : this.showPrompt(opts);
    }
}