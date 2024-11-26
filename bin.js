#!/usr/bin/env node

import { moonToVscWorkspace } from "./main.js";

moonToVscWorkspace(process.cwd(), process.argv[2]);
