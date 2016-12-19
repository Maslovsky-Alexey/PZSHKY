using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ElectronicSchem.Models.ElectronicSchemModels.Posts
{
    public class TagModel
    {
        public long ID { get; set; }

        public string Value { get; set; }

        public PostModel Post { get; set; }
    }
}