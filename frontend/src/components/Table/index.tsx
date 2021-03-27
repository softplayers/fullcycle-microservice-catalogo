// @flow 
import * as React from 'react';
import MUIDataTable, { MUIDataTableColumn, MUIDataTableOptions, MUIDataTableProps } from 'mui-datatables';
import { merge, omit, cloneDeep } from 'lodash';
import { MuiThemeProvider, Theme, useTheme } from '@material-ui/core';

export interface TableColumn extends MUIDataTableColumn {
    width?: string;
}

const defaultOptions: MUIDataTableOptions = {
    print: false,
    download: false,
    filter: true,
    textLabels: {
        body: {
            noMatch: 'Nenhum registro encontrado',
            toolTip: 'Classificar',
        },
        pagination: {
            next: 'Próxima página',
            previous: 'Página anterior',
            rowsPerPage: 'Por página: ',
            displayRows: 'de',
            jumpToPage: 'Pular para Página:',
        },
        toolbar: {
            search: 'Buscar',
            downloadCsv: 'Download CSV',
            print: 'Imprimir',
            viewColumns: 'Ver Colunas',
            filterTable: 'Filtrar Tabelas',
        },
        filter: {
            all: 'Todos',
            title: 'FILTROS',
            reset: 'LIMPAR',
        },
        viewColumns: {
            title: 'Ver Colunas',
            titleAria: 'Ver/Esconder Colunas da Tabela',
        },
        selectedRows: {
            text: 'restro(s) selecionado(s)',
            delete: 'Excluir',
            deleteAria: 'Excluir restro(s) selecionado(s)',
        }
    }
};

interface TableProps extends MUIDataTableProps {
    columns: TableColumn[]
}

const Table: React.FC<TableProps> = (props) => {

    const theme = cloneDeep(useTheme());

    function extractMuiDataTableColumns(columns: TableColumn[]): MUIDataTableColumn[]  {
        setColumnsWidth(columns);
        return columns.map(column => omit(column, 'width'));
    }
    
    function setColumnsWidth(columns: TableColumn[]) {
        columns.forEach((column, key) => {
            if (column.width) {
                const overrides = theme.overrides as any;
                overrides.MUIDataTableHeadCell.fixedHeader[`&:nth-child(${key + 2})`] = {
                    width: column.width
                }
            }
        });
    }

    const newProps = merge(
        { options: defaultOptions }, 
        props,
        {columns: extractMuiDataTableColumns(props.columns)},
    );

    return (
        <MuiThemeProvider theme={theme}>
            <MUIDataTable {...newProps} />
        </MuiThemeProvider>
    );
};

export default Table;