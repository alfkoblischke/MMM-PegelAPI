# MagicMirror² PegelAPI module
This is a module for `MagicMirror²`; the purpose of the module is to show you jokes from the JokeAPI.

## Installation
1.  Navigate into your MagicMirror's modules folder and execute git clone https://github.com/alfkoblischke/MMM-PegelAPI.git. A new folder will appear navigate into it.
2.  Edit your configuration file under `config/config.js` with the following configuration.
```
{
    module: 'MMM-PegelAPI',
    position: 'middle_center',
    config: {
        category: "Programming"
    }
}
```

### Preview
![Screenshot](screenshot.png)



## Configuration options

| Option                 | Description
|------------------------|-----------
| `category`          | The list of module names that are controlled by this module.<br>Possible values:<br>1.  `Programming`<br>2.  `Miscellaneous`<br>3.  `Dark`<br>4.  `Any`<br><br> **Type:** `string` <br>**Default value:** `Programming`
| `fetchInterval`| How often (in milliseconds) a new water level should be fetched.<br><br> **Type:** `number` <br>**Default value:** `10 * 1000`


#### Credits
MagicMirror²:   [MagicMirror²](https://github.com/MichMich/MagicMirror)   
