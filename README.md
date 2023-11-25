
# JodaStyle Documentation

Welcome to the JodaStyle documentation. This guide is intended for developers who want to use or contribute to the JodaStyle project. JodaStyle is a library that enables DOM manipulation using CSS attributes and provides a set of tools for defining templates, restructuring HTML input, and implementing responsive design through custom attributes and CSS variables.

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
  - [DOM Manipulation](#dom-manipulation)
  - [Defining Templates](#defining-templates)
  - [Using Templates](#using-templates)
  - [Processing HTML Input with JodaSplit](#processing-html-input-with-jodasplit)
  - [Responsive Design](#responsive-design)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Debugging](#debugging)
- [Contributing](#contributing)
- [License](#license)
- [FAQs](#faqs)

## Overview

JodaStyle is a library designed to render Markdown-style HTML in the browser and apply templates dynamically. It provides a set of tools for defining templates, restructuring HTML input, and implementing responsive design through the `layout=""` attribute.

## Installation

To install JodaStyle, run the following command in your project directory:

```bash
npm install @leuffen/jodastyle
```

## Usage

### DOM Manipulation

JodaStyle allows for DOM manipulation using CSS attributes. Here are some examples:

#### Wrap

Wrap multiple consecutive elements in a new element using the `--joda-wrap` attribute:

```html
<div class="box"></div>
<div class="box"></div>
<div class="box"></div>
```

```css
.box {
  --joda-wrap: @row;
}
```

The resulting DOM:

```html
<div class="row">
    <div class="box"></div>
    <div class="box"></div>
    <div class="box"></div>
</div>
```

#### Joda USE

The `--joda-use` attribute allows the use of a template:

```html
<div class="box" style="--joda-use='box'; --layout-cols: 3"></div>
```

Is equivalent to:

```html
<div class="box" layout="use: box; cols: 3"></div>
```

The template element is copied over the host element, potentially changing the tag.

### Defining Templates

Templates are defined using the `Joda.registerTemplate` method. Here's an example of defining a template:

```typescript
import { Joda } from "@leuffen/jodastyle";

Joda.registerTemplate("header1", `
    <section class="tjs-header1 :: mobile :lg: ">
        <div class="tjs-wrapper container-fluid">
            <div class="tjs-header1__hero container">
                <div class="tjs-header1__hero--row">
                    <div class="tjs-header1__hero--col tjs-header1__hero--col-text">
                        <slot></slot>
                    </div>
                    <div class="tjs-header1__hero--col tjs-header1__hero--col-image">
                        <slot data-select="img" data-replace></slot>
                    </div>
                </div>
            </div>
        </div>
    </section>
`);
```

### Using Templates

To use a template, apply it using the `layout` attribute:

```html
<div layout="use: #header1">
    <img src="/images/logo-systemwebsite.webp" alt="Logo"><!-- This image will be pulled to the image slot-->
    <p>Text</p>
    <blockquote>Text</blockquote>
    <div>Sub Elements</div>
</div>
```

### Processing HTML Input with JodaSplit

JodaSplit reorganizes flat HTML into a structured tree. For detailed information about the structure of the output, refer to the [jodasplit-output.html](/jodasplit/jodasplit-output.html) file.

### Responsive Design

Jodaresponsive replaces media queries in CSS files, drastically reducing file sizes. The syntax in the `class` attribute is as follows:

```html
<div class="col :: col-6 :md: col-4 :lg: col-2"></div>
```

Is equivalent to:

```html
<div class="col col-6 col-md-4 col-lg-2"></div>
```

## API Reference

The API reference is available in the [index.ts](/index.ts) file, which includes exported functions and classes from the JodaStyle library.

## Configuration

JodaStyle can be configured using `jodaSiteConfig`. For example, to disable the use of templates:

```javascript
import { jodaSiteConfig } from "@leuffen/jodastyle";

jodaSiteConfig.disable_templates = true;
```

## Debugging

To enable debugging, set the appropriate flags in `jodaSiteConfig`. For example, to visualize the template structure, set `debug_visualize` to `true`:

```javascript
jodaSiteConfig.debug_visualize = true;
```

## Contributing

Contributions are welcome! Please refer to the [Contributing](#contributing) section for guidelines on how to contribute to the project.

## License

JodaStyle is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## FAQs

Q: How do I override a default template?
A: To override a default template, simply register a new template with the same name as the default template you wish to override.

Q: Can I use JodaStyle with a static site generator?
A: Yes, JodaStyle can be used with static site generators. You will need to ensure that the JodaStyle library is included in your build process.

Q: What should I do if I encounter unexpected behavior?
A: If you encounter unexpected behavior, first ensure that you have followed the documentation correctly. Check for any typos or errors in your code. If the issue persists, enable debugging in `jodaSiteConfig` to get more insights. If you're still unable to resolve the problem, feel free to [open an issue](https://github.com/leuffen/jodastyle/issues) on GitHub with a detailed description of the problem and steps to reproduce it.

Q: Where can I find examples of using JodaStyle?
A: You can find examples throughout this documentation. Additionally, the [example.html](/example.html) file provides a practical example of how to use JodaStyle in a project.

Q: How can I contribute to JodaStyle if I'm not a programmer?
A: Non-programmers can contribute to JodaStyle by providing feedback, reporting issues, and suggesting improvements. Documentation contributions are also welcome.
