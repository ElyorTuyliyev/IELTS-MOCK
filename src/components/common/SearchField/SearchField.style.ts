import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Box, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

import { tokens, c } from '../../../theme/tokens'

export const StyledSearchField = styled(TextField)`
  width: 100%;

  & .MuiOutlinedInput-root {
    min-height: 46px;
    border-radius: 12px;
    background: ${c.surface.muted};
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    fieldset {
      border-color: ${c.border.default};
      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    &:hover {
      background: ${c.surface.default};

      fieldset {
        border-color: ${c.slate[300]};
      }
    }

    &.Mui-focused {
      background: ${c.surface.default};
      box-shadow: 0 0 0 3px ${tokens.rgba.primary_12};

      fieldset {
        border-color: ${c.info.light};
        border-width: 1px;
      }
    }

    &.Mui-focused .search-field__icon {
      color: ${c.info.light};
    }
  }

  & .MuiOutlinedInput-input {
    padding: 12px 14px 12px 4px;
    font-size: 0.95rem;
    color: ${c.text.primary};

    &::placeholder {
      color: ${c.slate[400]};
      opacity: 1;
    }

    &::-webkit-search-cancel-button {
      appearance: none;
    }
  }

  &.search-field--no-icon .MuiOutlinedInput-input {
    padding-left: 14px;
  }

  & .MuiInputAdornment-root {
    margin-right: 0;
  }

  & .MuiOutlinedInput-root.MuiInputBase-sizeSmall {
    min-height: 40px;
    border-radius: 10px;

    .MuiOutlinedInput-input {
      padding: 8px 10px 8px 2px;
      font-size: 0.875rem;
    }
  }
`

export const SearchFieldIconWrap = styled(Box)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${c.slate[400]};
  transition: color 0.2s ease;
`

export const SearchFieldIcon = styled(SearchOutlinedIcon)`
  font-size: 1.15rem;
`
