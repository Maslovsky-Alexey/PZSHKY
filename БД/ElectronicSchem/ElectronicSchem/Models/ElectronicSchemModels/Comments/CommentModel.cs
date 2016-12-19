using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ElectronicSchem.Models.ElectronicSchemModels.Comments
{
    public class CommentModel
    {
        [Key]
        public long ID { get; set; }

        public virtual ApplicationUser User { get; set; }

        public string Text { get; set; }

        public DateTime DateComment { get; set; }

        public Posts.PostModel Post { get; set; }
    }
}