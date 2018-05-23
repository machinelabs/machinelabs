import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProcessStreamData, OutputType, SpawnShellFn } from '@machinelabs/core';
import isNumber = require('lodash.isnumber');

export const RESERVED_KERNEL_MEMORY = 2 * 1024 * 1024;

export interface MemoryStats {
  totalMemoryKb: number;
  maxKernelMemoryKb: number;
  reservedKernelMemoryKb: number;
}

export class DockerMemoryLookup {
  constructor(private spawnShell: SpawnShellFn) {}

  getTotalMemory() {
    return this.spawnShell(`awk '/MemTotal/ {print $2}' /proc/meminfo`).pipe(
      map(val => (val.origin === OutputType.Stderr || isNaN(+val.str) ? 0 : +val.str))
    );
  }

  getMemoryStats(): Observable<MemoryStats> {
    return this.getTotalMemory().pipe(
      map(totalMemory => ({
        totalMemoryKb: totalMemory,
        reservedKernelMemoryKb: RESERVED_KERNEL_MEMORY,
        maxKernelMemoryKb: totalMemory > RESERVED_KERNEL_MEMORY ? totalMemory - RESERVED_KERNEL_MEMORY : 0
      }))
    );
  }
}
