#!/usr/bin/env node

const { execSync } = require("child_process");

const [, , ...ports] = process.argv;

const preparePorts = (list: string[]) => {
  // 8080...8089 => [8080, 8081, ... 8089]
  if (list.length === 1 && list[0].includes("...")) {
    const [start, end] = list[0].split("...");
    const len = parseInt(end) - parseInt(start);
    if (len < 0) {
      throw new Error(
        "Error: the input ports: 'start...end', but start > end !"
      );
    }
    return new Array(len + 1).fill(0).map((v, i) => parseInt(start) + i);
  }
  return list.map((v) => parseInt(v));
};

const getPid = (port: number): number => {
  try {
    const stdout = execSync(`lsof -t -i:${port}`).toString();
    return parseInt(stdout);
  } catch {
    return 0;
  }
};

const kill = (pid: number) => {
  try {
    execSync(`kill -9 ${pid}`);
  } catch {}
};

const portList = preparePorts(ports);

console.log(`kill ports: ${portList}`);
portList.forEach((port) => {
  const pid = getPid(port);
  if (pid) kill(pid);
});
console.log("kill ports: done");
