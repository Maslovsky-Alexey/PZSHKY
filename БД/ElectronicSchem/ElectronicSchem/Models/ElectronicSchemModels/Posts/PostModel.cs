using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ElectronicSchem.Models.ElectronicSchemModels;
using System.ComponentModel.DataAnnotations;
using ElectronicSchem.Models.ElectronicSchemModels.Schems;

namespace ElectronicSchem.Models.ElectronicSchemModels.Posts
{
    public class PostModel
    {
        [Key]
        public long ID { get; set; }

        public string UserID { get; set; }

        public string Title { get; set; }

        public string Discription { get; set; }

        public DateTime DatePost { get; set; }

        public long CategoryId { get; set; }

        public ICollection<Components.ComponentModel> Components { get; set; }

        public ICollection<WireModel> Wires { get; set; }

        public virtual ICollection<Comments.CommentModel> Comments { get; set; }

        public virtual ICollection<TagModel> Tags { get; set; }
    }
}