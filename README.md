
# JodaStyle Documentation

Welcome to the JodaStyle documentation. This guide is intended for developers who want to use or contribute to the JodaStyle project. JodaStyle is a library that enables you to manipulate the DOM using CSS attributes and apply templates dynamically. It provides a set of tools for defining templates, restructuring HTML input, and implementing responsive design through the `layout=""` attribute and CSS variables.

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
  - [Defining Templates](#defining-templates)
  - [Using Templates](#using-templates)
  - [DOM Manipulation Commands](#dom-manipulation-commands)
  - [Processing HTML Input with JodaSplit](#processing-html-input-with-jodasplit)
  - [Responsive Design](#responsive-design)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Debugging](#debugging)
- [Contributing](#contributing)
- [License](#license)
- [FAQs](#faqs)

## Overview

JodaStyle is a library designed to render Markdown-style HTML in the browser and apply templates dynamically. It provides a set of tools for defining templates, restructuring HTML input, and implementing responsive design through the `layout=""` attribute and CSS variables.

### Quick Reference

Here's a quick reference to the most important features of JodaStyle:

#### Commands
- `--joda-wrap`
- `--joda-use`
- `--joda-replace-by`
- `--joda-container`
- `--joda-unwrap`
- `--joda-group`
- `--joda-class`
- `--joda-on-empty-class`

#### Elements
- `<slot [data-select=""] [data-copy] [data-limit=""] [data-replace] [data-child-*=""]>`
- `<jodastyle>`
- `<jodasplit>`


## Installation

To install JodaStyle, run the following command in your project directory:

```bash
npm install @leuffen/jodastyle
```

## Usage

### Defining Templates

Templates are registered using `Joda.registerTemplate`:

```ts
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

Optional parameters for `registerTemplate` include callbacks and layout defaults. Callbacks can be used to execute functions after the template is connected to the DOM or after all templates are connected and initialized. Layout defaults provide default values for layout-related CSS variables.

Example using callbacks:

```ts
Joda.registerTemplate("footer1", `
    <footer class="tjs-footer1">
        ...
    </footer>
`, {}, {
    onAfterConnectedCallback: (element) => {
        console.log("Footer template connected:", element);
    },
    onAfterAllTemplatesConnectedCallback: (element) => {
        console.log("All templates connected:", element);
    }
});
```

In the example above, we define a template named `header1` that can be used to create a header section with text and an image. The `:: mobile :lg: ` syntax is used to apply responsive classes. The `<slot>` elements are placeholders that will be filled with content when the template is used.

#### Slot Attributes

| Attribute      | Description                                      | Example                           |
|----------------|--------------------------------------------------|-----------------------------------|
| `data-select`  | Selector for the content to replace the slot with | `<slot data-select="img"></slot>` |
| `data-replace` | Indicates that the slot content should be replaced | `<slot data-replace></slot>`      |
| `data-copy`    | Indicates that the content should be copied instead of moved | `<slot data-copy></slot>`         |

Slots are replaced in the order they are defined within the template. An element can only be selected once unless the `data-copy` attribute is set. If no `<slot>` element without a `data-select` attribute is found, elements that are not explicitly selected will be removed.

To add classes or wrap a sub-element of a slot into its own template, use the `data-child-class` attribute or the `--joda-wrap` command respectively.

### Using Templates

To apply a template, use the `layout` attribute:

```html
<div layout="use: #header1">
    <img src="/images/logo-systemwebsite.webp" alt="Logo"><!-- This image will be pulled to the image slot-->
    <p>Text</p>
    <blockquote>Text</blockquote>
    <div>Sub Elements</div>
</div>
```

It's important to include the `#` symbol when referencing a template to avoid unexpected behavior.

In the example above, the `layout="use: #header1"` attribute tells JodaStyle to apply the `header1` template to the `div`. The `img` element will replace the first slot with `data-select="img"`, and the rest of the content will fill the default slot.

### DOM Manipulation Commands

JodaStyle provides several commands for manipulating the DOM using CSS attributes:

| Command               | Description                                                                 | Example Usage                                                                 |
|-----------------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `--joda-wrap`         | Wraps elements with a new element                                           | `.box { --joda-wrap: @row; }`                                                 |
| `--joda-use`          | Applies a template to the element                                           | `<div class="box" style="--joda-use='box'; --layout-cols: 3"></div>`          |
| `--joda-replace-by`   | Replaces the element with the specified template                            | `--joda-replace-by: @header1;`                                                |
| `--joda-container`    | Wraps the element's children with the specified container                   | `--joda-container: @container;`                                               |
| `--joda-unwrap`       | Removes the parent element of the selected element                          | `--joda-unwrap: true;`                                                        |
| `--joda-group`        | Groups consecutive elements with the same `--joda-group` value into a wrapper| `--joda-group: @row;`                                                         |
| `--joda-class`        | Adds classes to the element                                                 | `--joda-class: 'new-class';`                                                  |
| `--joda-on-empty-class`| Adds a class to the element if it is empty                                  | `--joda-on-empty-class: 'empty';`                                             |

#### Wrap Command

The `--joda-wrap` command wraps one or more consecutive elements in a new element:

```css
.box {
  --joda-wrap: @row;
}
```

This will wrap elements with the class `.box` in a new element with the class `row`.

#### Use Command

The `--joda-use` command allows the use of a template:

```html
<div class="box" style="--joda-use='box'; --layout-cols: 3"></div>
```

This is equivalent to:

```html
<div class="box" layout="use: box; cols: 3"></div>
```

The `use` command copies the template element over the host element, potentially changing the tag.

### Processing HTML Input with JodaSplit

JodaSplit reorganizes flat HTML into a structured tree:

```html
<joda-split>
    <nav layout="use: #navbar-switch1" class="floating">
        ...
    </nav>
    <h1 layout="use: #header1" data-section-class="decreased-height">Kontakt</h1>
    ...
</joda-split>
```

JodaSplit transforms the input into a tree structure where `<h1>` and `<h2>` elements become `<section>` elements, while `<h3>` to `<h6>` become nested elements.

You can use `<hr>` elements to insert sub-elements. Additional attributes and classes set on an element with the `layout=""` attribute will be preserved.

For a detailed example of how JodaSplit processes input, see the [jodasplit-output.html](/examples/jodasplit/jodasplit-output.html) file.

### Responsive Design (Jodaresponsive)

JodaStyle includes a processor for responsive design, which applies classes based on the viewport size and custom responsive classes.

#### Responsive Class Syntax

The syntax for responsive classes is as follows:

```
class="class :: <defaultClass> :breakpoint: <alternativeClass>"
```

Example:

```html
<div class="col :: col-6 :md: col-4 :lg: col-2">
```

This is equivalent to:

```html
<div class="col col-6 col-md-4 col-lg-2">
```

#### Breakpoints

| Breakpoint | Width  |
|------------|--------|
| xsm        | 0px    |
| sm         | 576px  |
| md         | 768px  |
| lg         | 992px  |
| xl         | 1200px |
| xxl        | 1400px |

For more information on how to use responsive design with JodaStyle, refer to the [Jodaresponsive](/src/processor/jodaresponsive.ts) processor.

## API Reference

- `Joda.registerTemplate(name, template)`: Registers a new template.
- `Joda.getRegisteredTemplate(name)`: Retrieves a registered template.
- `JodaContentElement.setContent(content)`: Sets the content of a `JodaContentElement`.

For a complete API reference, please refer to the [index.ts](/src/index.ts) file.

## Configuration

JodaStyle can be configured using `jodaSiteConfig`:

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

Contributions are welcome! If you would like to contribute to the project, please follow these steps:

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Create a new branch for your feature or bug fix.
4. Make your changes and commit them to your branch.
5. Push your changes to your fork on GitHub.
6. Submit a pull request to the original repository.

Please make sure to write clear commit messages and include tests for your changes if applicable.

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
A: You can find examples throughout this documentation. Additionally, the [example.html](/examples/example.html) file provides a practical example of how to use JodaStyle in a project.

Q: How can I contribute to JodaStyle if I'm not a programmer?
A: Non-programmers can contribute to JodaStyle by providing feedback, reporting issues, and suggesting improvements. Documentation contributions are also welcome.

