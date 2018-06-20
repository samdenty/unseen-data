# unseen-data

Convert data to an unseen zero-width binary string.

## Example

```ts
import Unseen from 'unseen-data'
const unseen = new Unseen({ compression: true })

const encoded = unseen.encode('Hello world!')
// encoded = '​﻿​​​‍​‍‌​‍​‌‍‌‌‌‍﻿​‌‍﻿​‌‍﻿﻿​‍​​‌﻿‌﻿‌‍﻿﻿‌﻿​‍‌‍﻿​‌‍‌​​‍​‌​‍​‍'

const decoded = unseen.decode(encoded)
// decoded = 'Hello world!'
```

## Options

Options can be passed as an object in the constructor.

### `compression?: boolean`

By default, data is compressed with [pako](https://www.npmjs.com/package/pako) to reduce the length of the resulting strings.

### `charset?: [string, string, string, string]`

By default, `unseen-data` uses a Base4 charset consisting of four different types of invisible characters.
