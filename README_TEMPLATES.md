# JodaStyle Theme Developement Guide






## Defining Elements

```typescript
Joda.registerTemplate("service-slider__carousel--slide",
    // language=HTML
    `
        <div class="tjs-service-slider__carousel--slide">
            <div class="tjs-service-slider__carousel--slide__image">
                <slot data-select="img"></slot>
            </div>
            <div class="tjs-service-slider__carousel--slide__text">
                <slot></slot>
            </div>
        </div>`
    );
```


## The <slot> Element


| Attribute | Description                                                                            |
|-----------|----------------------------------------------------------------------------------------|
| data-select | Selects the contents of the slot. Will pull resulting elmeents into the <slot> element |
| data-clone | Clones the slot element. Can be used to clone a specific slot element.                 |
| data-child-* | Add the value to each child element of the slot. Can be used to add classes to the child elements. |



```html

<slot data-select=".children > *" data-child-layout="wrap: #someElement"></slot>

```

## The `layout`-Attribute (on every Element)

The layout attribute is a way to define layout options directly on a html element without using css classes.
(it will in fact be parsed to css variables). It is a convinient way to define layout options for a specific element.

```html
<div layout="use: #someElement; configOption: option"></div>
```

Will be parsed to `<div style="--joda-use: #someElement; --layout-configOption: option"></div>`
