<template>
  <Select>
    <SelectTrigger> </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="apple"> Apple </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
<script setup lang="ts">
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
  } from '@/components/ui/select';
</script>
