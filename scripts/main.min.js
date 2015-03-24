/*!
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
!function(){"use strict";function e(){n.classList.toggle("open"),i.classList.toggle("open"),c.classList.toggle("ui-mask-visible")}function t(){n.classList.remove("open"),i.classList.remove("open"),c.classList.remove("ui-mask-visible")}var s=document.querySelector.bind(document),n=document.body,i=s(".nav"),o=s(".menu"),c=s(".ui-mask-modal");o.addEventListener("click",e),c.addEventListener("click",e),i.addEventListener("click",function(e){("A"===e.target.nodeName||"LI"===e.target.nodeName)&&t()})}();