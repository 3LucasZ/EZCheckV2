import React, { useState } from "react";
import Router from "next/router";

import { MultiValue, Select } from "chakra-react-select";

import { FormControl, Input, Button, Box, useToast } from "@chakra-ui/react";
import { PrismaClient } from "@prisma/client";
import { StorageProps } from "components/Storage";
import { GetServerSideProps } from "next";
import { ItemProps } from "components/Item";
import Layout from "components/Layout";
import prisma from "services/prisma";
import { errorToast } from "services/toasty";

enum FormState {
  Input,
  Submitting,
}
type Props = {
  allStorages: StorageProps[];
  oldItem: ItemProps;
  admins: string[];
};
type RelateProps = {
  id: number;
};
const ItemDraft: React.FC<Props> = (props) => {
  const toaster = useToast();
  const allOptions = props.allStorages.map((storage) => ({
    value: storage.id,
    label: storage.name,
  }));
  const prefillOptions = props.oldItem.storages.map((storage) => ({
    value: storage.id,
    label: storage.name,
  }));
  const id = props.oldItem.id;
  const isNew = id == -1;
  const [name, setName] = useState<string>(isNew ? "" : props.oldItem.name);
  const [formState, setFormState] = useState(FormState.Input);
  const [storages, setStorages] = useState<
    MultiValue<{ value: number; label: string }>
  >(isNew ? [] : prefillOptions);
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setFormState(FormState.Submitting);
    try {
      const storageIds: RelateProps[] = [];
      storages.map((obj) => storageIds.push({ id: obj.value }));
      const body = { id, name, storageIds };
      console.log(body);
      const res = await fetch("/api/upsert-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.status == 500) {
        setFormState(FormState.Input);
        errorToast(toaster, "Item " + name + " already exists.");
      } else {
        setFormState(FormState.Input);
        await Router.push(isNew ? "view-items" : "item/" + id);
      }
    } catch (error) {
      setFormState(FormState.Input);
      console.error(error);
    }
  };

  return (
    <Layout admins={props.admins}>
      <Box h="calc(100vh)">
        <div className="add-item-form">
          <form onSubmit={submitData}>
            <FormControl>
              <Input
                value={name}
                variant="filled"
                marginTop={10}
                placeholder="Item name"
                isDisabled={formState === FormState.Input ? false : true}
                onChange={(e) => setName(e.target.value)}
              ></Input>
              <Select
                isMulti
                name="storages"
                options={allOptions}
                value={storages}
                placeholder="Select storages"
                closeMenuOnSelect={false}
                onChange={(e) => setStorages(e)}
                size="lg"
              />
              <Button
                mt={4}
                size="lg"
                colorScheme="teal"
                type="submit"
                isLoading={formState == FormState.Input ? false : true}
              >
                {isNew ? "Add Item" : "Update Item"}
              </Button>
            </FormControl>
          </form>
        </div>
      </Box>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  //prisma
  const allStorages = await prisma.storage.findMany();
  const admins = await prisma.admin.findMany();
  const { id } = context.query;
  const realId = id == undefined ? -1 : Number(id);
  const find = await prisma.item.findUnique({
    where: {
      id: realId,
    },
    include: {
      storages: true,
    },
  });
  const oldItem = find == null ? { id: -1, name: "", storages: [] } : find;
  //ret
  return {
    props: {
      allStorages: allStorages,
      oldItem: oldItem,
      admins: admins.map((admin) => admin.email),
    },
  };
};

export default ItemDraft;
