<template>
  <span>
    <DefinitionOr v-if="definition[0] === 'or'" :op="definition[1]" />
    <DefinitionAnd v-if="definition[0] === 'and'" :op="definition[1]" />
    <DefinitionAddress v-if="definition[0] === 'address'" :op="definition[1]" />
    <DefinitionInDataFeed v-if="definition[0] === 'in data feed'" :op="definition[1]" />
    <DefinitionHas v-if="definition[0] === 'has'" :op="definition[1]" />
    <DefinitionSeen v-if="definition[0] === 'seen'" :op="definition[1]" />
    <DefinitionNot v-if="definition[0] === 'not'" :op="definition[1]" />
    <DefinitionROfSet v-if="definition[0] === 'r of set'" :op="definition[1]" />
    <DefinitionSig v-if="definition[0] === 'sig'" :op="definition[1]" />
    <b
      style="color: red;"
      v-if="!['or', 'and', 'address', 'in data feed', 'has', 'seen', 'not', 'r of set', 'sig'].includes(definition[0])"
    >
      uncovered: {{JSON.stringify(definition[0])}}
    </b>
  </span>
</template>

<script>
export default {
  props: ['definition'],
  data () {
    return {
      ops: [
        '/or', '/and', '/r of set', 'weighted and', '/sig', 'hash', '/address', 'definition template',
        'seen address', 'seen definition change', 'has definition change', 'cosigned by', '/not',
        '/in data feed', 'in merkle', 'mci', 'age', '/has', 'has one', '/seen', 'has equal',
        'has one equal', 'sum',
      ]
    }
  }
}
</script>
