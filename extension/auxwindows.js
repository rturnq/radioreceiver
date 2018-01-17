// Copyright 2013 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Functions for managing auxiliary windows.
 */
var AuxWindows = (function() {
  var openWindows = [];

  /**
   * Shows a window to save a preset.
   * @param {number} frequency The current frequency.
   * @param {number} display The frequency's display name.
   * @param {number} name The current name for the station.
   * @param {string} band The name of the station's band.
   * @param {string} mode The station's mode.
   */
  function savePreset(frequency, name, band) {
    var win = openDialog('savedialog.html', 'savedialog', 300, 110);
    var modeData = copyObject(band.getMode());
    modeData['step'] = band.getStep();
    var stationData = {
      'frequency': frequency,
      'display': band.toDisplayName(frequency, true),
      'band': band.getName(),
      'mode': modeData,
      'name': name
    };

    win['opener'] = window;
    win['station'] = stationData;
  }

  /**
   * Opens a window
   */
  function openWindow(url, name, options) {
    closeWindow(name);
    var optionsString = Object.keys(options).map(function (key) {
      return key + '=' + options[key];
    }).join(',');

    var win = window.open(url, name, optionsString); 

    win.addEventListener('beforeunload', function () {
      var index = openWindows.indexOf(win);
      if (index >= 0) {
        openWindows.splice(index, 1);
      }
    });
    openWindows.push(win);
    return win;
  }

  /**
   * Opens a dialog window
   */
  function openDialog(url, name, width, height) {
    return openWindow(url, name, {
      width: width || 1,
      height: height || 1,
      left: width ? window.screenLeft + (window.outerWidth - width) / 2 : 0,
      top: height ? window.screenTop + (window.outerHeight - height) / 2 : 0,
      resizable: 0,
      menubar: 0,
      toolbar: 0,
      location: 0,
      status: 0,
      scrollbars: 0,
      dialog: 1
    })
  }

  /**
   * Closes a window by name
   */
  function closeWindow(name) {
    var index = openWindows.findIndex(function (win) {
      return win.name === name;
    });
    if (index >= 0) {
      var win = openWindows[index];
      win.close();
    }
  }

  /**
   * Makes a copy of an object as a map.
   */
  function copyObject(obj) {
    var dest = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        dest[key] = obj[key];
      }
    }
    return dest;
  }

  /**
   * Shows a window to change the application settings.
   * @param {Object} settings The current settings.
   */
  function settings(settings) {

    var win = openDialog('settings.html', 'settings', 350, 345);
    win['opener'] = window;
    win['settings'] = settings;
  }

  /**
   * Shows a window for the frequency correction factor estimator.
   * @param {AppWindow} mainWindow The app's main window.
   */
  function estimatePpm(mainWindow) {
    var win = openDialog('estimateppm.html', 'estimateppm', 350, 290);
    win['opener'] = window;
    win['mainWindow'] = mainWindow;
  }

  /**
   * Shows a window to manage the presets.
   * @param {AppWindow} mainWindow The app's main window.
   */
  function managePresets(mainWindow) {
    var win = openDialog('presetmanager.html', 'presetmanager', 700, 675);
    win['opener'] = window;
    win['mainWindow'] = mainWindow;
    trackWindow(win);
  }

  /**
   * Shows an error window.
   * @param {string} msg The error message to show.
   */
  function error(msg) {
    alert('There was a problem: ' + msg);
  }

  /**
   * Shows the help window.
   * @param {string} anchor An optional anchor to jump to.
   */
  function help(anchor) {
    var win = openDialog('help.html' + (anchor ? '#' + anchor : ''), 'help', 700, 600);
    trackWindow(win);
  }

  /**
   * Resizes the current window to the given dimensions, compensating for zoom.
   * @param {number} width The desired width.
   * @param {number} height The desired height. 0 to set it automagically.
   */
  function resizeCurrentTo(width, height) {
    var chromeWidth = window.outerWidth - window.innerWidth;
    var chromeHeight = window.outerHeight - window.innerHeight;
    window.resizeTo(width + chromeWidth, height + chromeHeight);
  }

  /**
   * Closes the current window.
   */
  function closeCurrent() {
    if (window.opener) {
      window.close();
    } else {
      alert('Use the browser close button');
    }
  }

  /**
   * Closes all windows.
   */
  function closeAll() {
    var open = openWindows.slice();
    for (i = 0, len = openWindows.length; i < len; i++) {
      open[i].close();
    }
  }

  window.addEventListener('beforeunload', function () {
    closeAll();
  });

  return {
    savePreset: savePreset,
    settings: settings,
    estimatePpm: estimatePpm,
    managePresets: managePresets,
    error: error,
    help: help,
    resizeCurrentTo: resizeCurrentTo,
    closeCurrent: closeCurrent,
    closeAll: closeAll,
    openWindow: openWindow,
    openDialog: openDialog
  };

})();
