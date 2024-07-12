<script setup>
import { computed, ref } from "vue";
import Highlight from "./Highlight.vue";
import SingleLineHighlight from "./SingleLineHighlight.vue";

const matchValue = ref(
  'License(s): KRD 03393 VE, The use of subsoil plots for geological study and production of groundwater, used for drinking water supply or for process water supply of industrial facilities, 01.01.2035,AN 23-001735, , Unlimited,L041-01126-23/00299529, MEDICAL ACTIVITIES (EXCEPT SPECIFIED ACTIVITY CARRIED OUT BY MEDICAL AND OTHER ORGANIZATIONS WITHIN THE PRIVATE HEALTH CARE SYSTEM ON THE TERRITORY OF THE "SKOLKOVO" INNOVATION CENTER), Unlimited,LO-23-01-008826, MEDICAL ACTIVITIES (EXCEPT SPECIFIED ACTIVITY CARRIED OUT BY MEDICAL AND OTHER ORGANIZATIONS WITHIN THE PRIVATE HEALTH CARE SYSTEM ON THE TERRITORY OF THE "SKOLKOVO" INNOVATION CENTER), Unlimited,OT-30-001930 (23), Activities of decontamination and disposal of waste of I - IV class of danger, Unlimited,VKH-30 006592 Pereoform, Operation of explosive, inflammable and chemically hazardous production facilities of I, II and III classes of danger, Unlimited,VP-30 003561 Predostav, Operation of explosive, inflammable and chemically hazardous production facilities of I, II and III classes of danger, Unlimited,PM-30 001485 PEREOFORM, Underground survey, Unlimited'
);
const highlights = ref(['Hong Kong:00882', 'Kong:00882', '00882', 'hong', 'kong', 'Hong'])
// const highlights = ref(["00882"]);

</script>

<template>
  <!-- <HighlightText :matchValue="matchValue" :highlights="highlights" /> -->
  <SingleLineHighlight :text="matchValue" :highlights="highlights">
    <template #default="{ renderText }">
      <Highlight :text="renderText" :highLights="highlights" />
    </template>
  </SingleLineHighlight>
</template>

<style scoped>
.match-value {
  width: 80%;
  min-height: 400px;
}
</style>
