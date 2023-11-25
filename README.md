
# JodaStyle Documentation

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
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

To include JodaStyle in your project, add the following script and stylesheet to your HTML:

```html
<script src="path/to/jodastyle.js"></script>
<link rel="stylesheet" href="path/to/jodastyle.css">
```

## Usage

### Defining Templates

Templates are registered using `Joda.registerTemplate`:

```typescript
import { Joda } from "@leuffen/jodastyle";

Joda.registerTemplate("header1", `
    <section class="tjs-header1">
        ...
        <slot></slot>
        <slot data-select="img" data-replace></slot>
        ...
    </section>
`);
```

#### Slot Attributes

| Attribute     | Description                                      | Example                           |
|---------------|--------------------------------------------------|-----------------------------------|
| `data-select` | Selector for the content to replace the slot with | `<slot data-select="img"></slot>` |
| `data-replace`| Indicates that the slot content should be replaced | `<slot data-replace></slot>`      |

### Using Templates

To apply a template, use the `layout` attribute:

```html
<div layout="use: #header1">
    <img src="logo.webp" alt="Logo">
    <p>Some text here</p>
</div>
```

### Processing HTML Input with JodaSplit

JodaSplit reorganizes flat HTML into a structured tree:

```html
<joda-split>
    <nav layout="use: #navbar"></nav>
    <h1 layout="use: #header1">Page Title</h1>
    ...
</joda-split>
```

### Responsive Design

JodaStyle includes a processor for responsive design, which applies classes based on the viewport size and custom responsive classes.

## API Reference

- `Joda.registerTemplate(name, template)`: Registers a new template.
- `Joda.getRegisteredTemplate(name)`: Retrieves a registered template.
- `JodaContentElement.setContent(content)`: Sets the content of a `JodaContentElement`.

## Configuration

JodaStyle can be configured using `jodaSiteConfig`:

```javascript
import { jodaSiteConfig } from "@leuffen/jodastyle";

jodaSiteConfig.disable_templates = true;
```

## Debugging

To enable debug visualization and see the processed content structure:

```javascript
jodaSiteConfig.debug_visualize = true;
```

## Contributing

Contributions are welcome through standard GitHub pull requests. Please ensure you follow the project's coding standards and include tests for any new or changed functionality.

## License

JodaStyle is MIT licensed. See the LICENSE file for details.

## FAQs

**Q: How do I define a new template?**
A: Use the `Joda.registerTemplate` method to define a new template. Provide a unique name and the HTML structure for the template.

**Q: Can I use JodaStyle for responsive design?**
A: Yes, JodaStyle includes a processor for responsive design that allows you to apply classes based on the viewport size.

**Q: How can I contribute to JodaStyle?**
A: Contributions can be made via GitHub pull requests. Please ensure your code adheres to the project's standards and includes appropriate tests.

